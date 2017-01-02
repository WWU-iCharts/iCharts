// @flow
'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ChartInformationContainer from './ChartInformationContainer';
import { Colors } from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontStyles } from '../styles';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const emptyHeartIcon = 'ios-heart-outline';
const fullHeartIcon = 'ios-heart';

export default class ChartCell extends Component {
  constructor(props) {
    super(props);

    // store heart color in state to toggle the color faster than waiting
    // for the re-render after the realm write
    this.state = {
      heartIcon: this.props.vfrChart.isFavorited ? fullHeartIcon : emptyHeartIcon,
      heartColor: this.props.vfrChart.isFavorited ? Colors.highlight : Colors.border,
      animatedIconSpringValue: new Animated.Value(1),
    };

    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.springHeart = this.springHeart.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.vfrChart.regionId === this.props.vfrChart.regionId)
      return;

    this.setState({
      heartIcon: nextProps.vfrChart.isFavorited ? fullHeartIcon : emptyHeartIcon,
      heartColor: nextProps.vfrChart.isFavorited ? Colors.highlight : Colors.border,
    });
  }

  toggleExpanded() {
    if (!this.informationExpander)
      return;

    this.informationExpander.toggleExpanded();
  }

  springHeart() {
    this.setState({
      heartIcon: this.state.heartIcon === emptyHeartIcon ? fullHeartIcon : emptyHeartIcon,
      heartColor: this.state.heartColor === Colors.border ? Colors.highlight : Colors.border
    });

    this.state.animatedIconSpringValue.setValue(0.5);
    Animated.spring(
      this.state.animatedIconSpringValue,
      {
        toValue: 1,
        friction: 3,
      }
    ).start();
  }

  render() {
    const { heartIcon, heartColor } = this.state;

    return (
      <View>
        <View style={styles.inputsContainer}>
          <View style={styles.vfrText}>
            <TouchableOpacity onPress={this.toggleExpanded} activeOpacity={0.5}>
              <Text style={FontStyles.thin}>
                {this.props.vfrChart.regionId}
                {"\n"}
                {this.props.vfrChart.regionName}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              activeOpacity={1.0}
              style={styles.icon}
              onPress={() => {
                this.springHeart();
                this.props.onFavorited(this.props.vfrChart);
              }}>
              <AnimatedIcon
                style={{paddingTop: 3, transform: [{scale: this.state.animatedIconSpringValue}]}}
                name={heartIcon}
                size={30}
                color={heartColor}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.icon}
              onPress={() => this.props.onChartPressed(this.props.vfrChart)}>
              <Icon style={{paddingTop: 3}} name="ios-arrow-forward" size={30} color={Colors.border} />
            </TouchableOpacity>
          </View>
        </View>

        <ChartInformationContainer
          ref={(informationExpander) => { this.informationExpander = informationExpander; }}
          vfrChart={this.props.vfrChart}
        />

        <View style={styles.border} />
      </View>
    );
  }
}

ChartCell.propTypes = {
    vfrChart: PropTypes.object.isRequired,
    onChartPressed: PropTypes.func.isRequired,
    onFavorited: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  inputsContainer:{
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    alignItems: 'center',
  },
  border: {
    borderColor: '#D3D3D3',
    borderBottomWidth: 0.5,
  },
  vfrText: {
    flex: 1,
    paddingTop: 10,
  },
  icon: {
    height: 30,
    margin: 15,
    width: 30,
  },
});
